import { InjectQueue, OnQueueActive, OnQueueCompleted, OnQueueDrained, OnQueuePaused, OnQueueResumed, OnQueueWaiting, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Processor('audio')
export class AudioProcessor {

  private readonly logger = new Logger(AudioProcessor.name);

  constructor(@InjectQueue('video') private readonly videoQueue: Queue) { }

  @Process()
  async handleTranscode(job: Job) {
    await new Promise(r => setTimeout(r, 300))
  }

  @OnQueueActive()
  onActive(job: Job<any>) {
    this.logger.debug("started " + job.data.file + "  " + Date.now());
  }

  @OnQueueWaiting()
  async onwaiting(job: Job<any>) {
    let boolPaused = await this.videoQueue.isPaused()

    if (!boolPaused) {
      console.log("Pause video Queue" + "  " + Date.now())
      this.videoQueue.pause()
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job<any>) {
    this.logger.debug("ended " + job.data.file + "  " + Date.now());
  }

  @OnQueueDrained()
  async onDrained() {
    let boolPaused = await this.videoQueue.isPaused()

    if (boolPaused) {
      this.videoQueue.resume()
    }
  }

}

@Processor('video')
export class VideoProcessor {
  private readonly logger = new Logger(VideoProcessor.name);



  @Process()
  async handleTranscode(job: Job) {

    await new Promise(r => setTimeout(r, 300))
  }

  @OnQueueActive()
  onActive(job: Job<any>) {
    this.logger.debug("started " + job.data.file + "  " + Date.now());
  }

  @OnQueueCompleted()
  onCompleted(job: Job<any>) {
    this.logger.debug("ended " + job.data.file + "  " + Date.now());
  }

  @OnQueueResumed()
  onResumed() {
    console.log(`Resumed video Queue` + "  " + Date.now())
    // queue is resumed now
  }

  @OnQueuePaused()
  onPaused() {
    console.log(`Paused video Queue` + "  " + Date.now())
    // queue is paused now
  }
}