import axios from 'axios';
import type { BatcherOptions, BatchedEvent } from './reporter';

export class ErrorBatcher {
  private queue: BatchedEvent[] = [];
  private isFlushing = false;
  private flushTimer: number;
  private readonly apiKey: string;

  constructor(private opts: BatcherOptions) {
    this.apiKey = opts.apiKey;
    const interval = opts.flushIntervalMs ?? 3000;
    this.flushTimer = window.setInterval(() => this.flush(), interval);
    window.addEventListener('beforeunload', () => this.flushOnUnload());
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public capture(evt: Omit<BatchedEvent, 'id' | 'timestamp'>): string {
    const id = this.makeId();
    const timestamp = new Date().toISOString();
    const record: BatchedEvent = { id, timestamp, ...evt };

    if (this.queue.length >= (this.opts.maxBufferSize ?? 64)) {
      this.queue.shift();
    }
    this.queue.push(record);
    return id;
  }

  private async flush() {
    if (this.isFlushing || this.queue.length === 0) return;
    this.isFlushing = true;

    const batch = this.queue.splice(0, this.queue.length);
    try {
      await axios.post(
        this.opts.endpoint,
        { events: batch },
        {
          maxBodyLength: 1000 * 1024 * 1024, // 10MB
          maxContentLength: 1000 * 1024 * 1024, // 10MB
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.opts.apiKey}`,
          },
        }
      );
    } catch {
      this.queue.unshift(...batch);
    } finally {
      this.isFlushing = false;
    }
  }

  private flushOnUnload() {
    if (!navigator.sendBeacon || this.queue.length === 0) return;
    const payload = JSON.stringify({ events: this.queue });
    navigator.sendBeacon(this.opts.endpoint, payload);
  }

  private makeId() {
    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  public destroy() {
    clearInterval(this.flushTimer);
  }
}
