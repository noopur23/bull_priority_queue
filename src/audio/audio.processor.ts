import { InjectQueue, OnQueueActive, OnQueueCompleted, OnQueueDrained, OnQueuePaused, OnQueueResumed, OnQueueWaiting, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Processor('audio')
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);

  constructor(@InjectQueue('video') private readonly videoQueue: Queue){}

  @Process()
  handleTranscode(job: Job) {
  }

  @OnQueueActive()
    async onActive(job: Job<any>) {
        this.logger.debug("started " + job.data.file);
    }

    @OnQueueWaiting()
    onwaiting(job: Job<any>) {
        if (!this.videoQueue.isPaused)
        {
            console.log(`Paused video Queue`)
            this.videoQueue.pause()
        }
    }

    @OnQueueCompleted()
    onCompleted(job: Job<any>) {
        this.logger.debug("ended " + job.data.file);
    }

    @OnQueueDrained()
    onDrained() {
        if (this.videoQueue.isPaused)
            this.videoQueue.resume()
    }

}

@Processor('video')
export class VideoProcessor {
  private readonly logger = new Logger(VideoProcessor.name);

  @Process()
  handleTranscode(job: Job) {
  }

  @OnQueueActive()
  onActive(job: Job<any>) {
    this.logger.debug("started " + job.data.file);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<any>) {
    this.logger.debug("ended " + job.data.file);
  }

  @OnQueueResumed()
  onResumed() {
      console.log(`Resumed video Queue`)
      // queue is resumed now
  }

  @OnQueuePaused()
  onPaused() {
      console.log(`Paused video Queue`)
      // queue is paused now
  }
}