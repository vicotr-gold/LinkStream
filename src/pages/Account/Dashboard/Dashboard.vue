<template>
    <div class="page">
        <h1>Dashboard Page</h1>

        <div class="my-4">
            <LoadingSpinner class="text-left m-0" animation="bounce" />
            <LoadingSpinner class="text-left m-0" animation="pulse" />
            <LoadingSpinner class="text-left m-0" animation="scale" />
        </div>

        <div class="mb-4">
            <basic-button>Add Video</basic-button>
            &nbsp;
            <basic-button size="md">Add Video</basic-button>
            &nbsp;
            <basic-button size="sm">Add Video</basic-button>
            &nbsp;
            <basic-button size="xs">Add Video</basic-button>
        </div>

        <div class="mb-4">
            <basic-button variant="secondary">Add Video</basic-button>
            &nbsp;
            <basic-button variant="secondary" size="md">Add Video</basic-button>
            &nbsp;
            <basic-button variant="secondary" size="sm">Add Video</basic-button>
            &nbsp;
            <basic-button variant="secondary" size="xs">Close</basic-button>
        </div>

        <div class="mb-4">
            <basic-button variant="tertiary">Add Video</basic-button>
            &nbsp;
            <basic-button variant="secondary" size="md">Add Video</basic-button>
            &nbsp;
            <basic-button variant="tertiary" size="sm">Add Video</basic-button>
            &nbsp;
            <basic-button variant="tertiary" size="xs">Add Video</basic-button>
        </div>

        <div class="mb-4">
            <basic-button variant="outline-light">Add Video</basic-button>
            &nbsp;
            <basic-button variant="outline-light" size="md"
                >Add Video</basic-button
            >
            &nbsp;
            <basic-button variant="outline-light" size="sm"
                >Add Video</basic-button
            >
            &nbsp;
            <basic-button variant="outline-light" size="xs"
                >Add Video</basic-button
            >
        </div>

        <div class="mb-4">
            <div class="custom-control custom-radio custom-control-inline">
                <input
                    type="radio"
                    id="customRadioInline1"
                    name="customRadioInline1"
                    class="custom-control-input"
                    checked
                />
                <label class="custom-control-label" for="customRadioInline1">
                    Option 1
                </label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
                <input
                    type="radio"
                    id="customRadioInline2"
                    name="customRadioInline1"
                    class="custom-control-input"
                />
                <label class="custom-control-label" for="customRadioInline2">
                    Option 2
                </label>
            </div>
        </div>

        <div class="mb-4">
            <DropAudio
                :src="audioFile && audioFile.base64"
                @add-file="handleAudioAdd"
                @remove-file="handleAudioRemove"
            />
            <DropFile />
            <DropImage />
        </div>

        <MiniAudioPlayer />
    </div>
</template>

<script>
import { DropAudio, DropImage, DropFile } from '~/components/Uploader'
import { MiniAudioPlayer } from '~/components/Player'
export default {
    name: 'Dashboard',
    components: {
        DropAudio,
        DropFile,
        DropImage,
        MiniAudioPlayer,
    },
    data() {
        return {
            audioFile: null,
        }
    },
    methods: {
        handleAudioAdd(file) {
            this.audioFile = file
        },
        handleAudioRemove() {
            this.audioFile = null
        },
    },
}
</script>
