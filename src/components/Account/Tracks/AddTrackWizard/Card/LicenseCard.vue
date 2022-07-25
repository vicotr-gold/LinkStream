<template>
    <div class="Card LicenseCard" :class="{ 'is-editing': isEditMode }">
        <IconButton
            icon="close"
            class="card-close-btn"
            title="Close"
            @click="handleCancelClick"
        />
        <section class="view-section">
            <b-form-checkbox
                :checked="checked"
                @change="handleCheckChange"
            ></b-form-checkbox>
            <div class="card-body">
                <h4 class="card-title">
                    {{ license.title }} - ${{ license.price | trimZeroDecimal }}
                </h4>
                <small>
                    {{ license.descripcion }}
                </small>
            </div>
            <BasicButton
                variant="icon"
                class="card-edit-btn"
                title="Edit"
                @click="handleEditClick"
            />
        </section>
        <section class="edit-section">
            <div class="edit-form">
                <b-form-group label="Adjust price">
                    <b-form-input
                        type="number"
                        placeholder="e.g. 25.00"
                        v-model="$v.form.price.$model"
                        :state="!$v.form.price.$error"
                    />
                    <b-form-invalid-feedback>
                        Enter a price
                    </b-form-invalid-feedback>
                </b-form-group>
            </div>
            <div class="card-edit-actions">
                <div class="left-col">
                    To customize your default license terms, go to
                    <basic-button
                        variant="link"
                        :to="{ name: 'accountTracksLicenses' }"
                    >
                        Licenses
                    </basic-button>
                </div>
                <div class="right-col">
                    <basic-button
                        class="cancel-btn"
                        size="sm"
                        variant="secondary"
                        @click="handleCancelClick"
                    >
                        Cancel
                    </basic-button>
                    <basic-button
                        size="sm"
                        variant="black"
                        @click="handleSaveClick"
                    >
                        Save
                    </basic-button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'LicenseCard',
    props: {
        checked: {
            type: Boolean,
            default: false,
        },
        license: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isEditMode: false,
            form: {
                price: this.license.price,
            },
        }
    },
    validations: {
        form: {
            price: {
                required,
            },
        },
    },
    methods: {
        close() {
            this.isEditMode = false
        },
        resetForm() {
            this.form.price = this.license.price
        },
        handleEditClick() {
            this.isEditMode = true
        },
        handleCancelClick() {
            this.close()
            this.resetForm()
        },
        handleCheckChange(checked) {
            this.$emit(checked ? 'checked' : 'unchecked', this.license)
        },
        handleSaveClick() {
            this.$v.form.$touch()
            if (this.$v.form.$invalid) {
                return
            }
            this.$emit('updated', {
                ...this.license,
                price: this.form.price,
            })
            this.close()
        },
    },
}
</script>
