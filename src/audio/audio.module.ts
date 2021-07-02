import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioProcessor, VideoProcessor } from './audio.processor';

@Module({
    imports: [
        BullModule.registerQueue(
            {
                name: 'audio',
            }
            ,
            {
                name: 'video',
            }

        ),
    ],
    controllers: [AudioController],
    providers: [AudioProcessor,VideoProcessor],
})
export class AudioModule { }