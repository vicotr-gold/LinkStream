<template>
    <div class="page page-link-add">
        <nav class="page-nav">
            <basic-button
                class="back-btn"
                variant="text"
                :to="{ name: 'accountLinks' }"
            >
                <i class="ico ico-back"></i>
                <span>Links</span>
            </basic-button>
        </nav>
        <div class="fwz">
            <section class="fwz-step">
                <header class="step-header">
                    <h2 class="step-title">Add a link</h2>
                </header>
                <main class="step-body">
                    <div class="left-col">
                        <div class="fieldset">
                            <b-form-group
                                label="Copy &amp; Paste Your Link URL"
                                label-for="urlInput"
                            >
                                <b-form-input
                                    v-model="$v.form.url.$model"
                                    :state="!$v.form.url.$error"
                                    placeholder="e.g. https://myblog.blogspot.com"
                                    id="urlInput"
                                />
                                <b-form-invalid-feedback>
                                    <template v-if="!$v.form.url.required">
                                        Enter the URL
                                    </template>
                                    <template v-else>
                                        That's not a valid URL
                                    </template>
                                </b-form-invalid-feedback>
                            </b-form-group>

                            <b-form-group
                                label="Link Title"
                                label-for="titleInput"
                            >
                                <b-form-input
                                    v-model="$v.form.title.$model"
                                    id="titleInput"
                                    placeholder="e.g. My Blog"
                                    :state="!$v.form.title.$error"
                                />
                                <b-form-invalid-feedback>
                                    Enter a title
                                </b-form-invalid-feedback>
                            </b-form-group>

                            <b-form-group label="Link Visibility">
                                <b-form-radio-group v-model="form.visibility">
                                    <b-form-radio value="1">
                                        Visible
                                    </b-form-radio>
                                    <b-form-radio value="2">
                                        Hidden
                                    </b-form-radio>
                                </b-form-radio-group>
                            </b-form-group>

                            <div v-if="form.scheduled">
                                <b-form-group label="Start Date">
                                    <b-input-group class="date-input-group">
                                        <DatePicker v-model="form.date" />
                                        <TimePicker v-model="form.time" />
                                    </b-input-group>
                                </b-form-group>
                                <b-form-group>
                                    <b-form-checkbox v-model="showEndDate">
                                        Set end date
                                    </b-form-checkbox>
                                </b-form-group>
                                <b-form-group
                                    label="End Date"
                                    v-if="showEndDate"
                                >
                                    <b-input-group class="date-input-group">
                                        <DatePicker v-model="form.endDate" />
                                        <TimePicker v-model="form.endTime" />
                                    </b-input-group>
                                </b-form-group>
                            </div>

                            <basic-button
                                variant="link"
                                @click="handleScheduleToggle"
                            >
                                {{
                                    form.scheduled
                                        ? 'Clear scheduling '
                                        : 'Schedule this link'
                                }}
                            </basic-button>
                        </div>
                    </div>
                    <div class="right-col">
                        <DropImage
                            :src="form.coverArtBase64"
                            @add-file="handleImageAdd"
                            @remove-file="handleImageRemove"
                        />
                    </div>
                </main>
            </section>
            <footer class="fwz-pager">
                <basic-button
                    class="fwz-prev-btn"
                    variant="secondary"
                    :to="{ name: 'accountLinks' }"
                    :disabled="processing"
                >
                    Cancel
                </basic-button>
                <spinner-button
                    class="fwz-next-btn"
                    :loading="processing"
                    @click="handleSaveClick"
                >
                    Add Link
                </spinner-button>
            </footer>
        </div>
    </div>
</template>

<script>
import { linkAddEditForm } from '~/mixins/links/linkAddEditForm'

export default {
    name: 'LinkAdd',
    mixins: [linkAddEditForm],
    methods: {
        handleScheduleToggle() {
            this.form.scheduled = !this.form.scheduled
        },
    },
}
</script>
