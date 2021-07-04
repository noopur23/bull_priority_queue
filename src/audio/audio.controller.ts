import { InjectQueue } from '@nestjs/bull';
import { Controller, Post } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('audio')
export class AudioController {
    constructor(
        @InjectQueue('audio') private readonly audioQueue: Queue,
        @InjectQueue('video') private readonly videoQueue: Queue
    ) { }

    @Post('audio')
    async transcode() {

        for (let i = 0; i < 10; i++) {
            await this.audioQueue.add({
                file: i,
            });
            await new Promise(r => setTimeout(r, 100))
        }
    }
    @Post('video')
    async postVideo() {
        for (let j = 0; j < 30; j++) {
            await this.videoQueue.add({
                file: j,
            });
            await new Promise(r => setTimeout(r, 100))
        }
    }
}