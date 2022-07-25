export const collabsProfitFormMixin = {
    methods: {
        handleCollabRemoveClick(index) {
            const { collabs } = this.form
            collabs.splice(index, 1)
            const subCollabs = collabs.slice(1)
            const subCollabsTotalProfit = subCollabs.reduce(
                (total, { profit }) => {
                    return total + Number(profit)
                },
                0
            )
            const subCollabsTotalPublishing = subCollabs.reduce(
                (total, { publishing }) => {
                    return total + Number(publishing)
                },
                0
            )
            const mainCollab = collabs[0]
            mainCollab.profit = 100 - subCollabsTotalProfit
            mainCollab.publishing = 100 - subCollabsTotalPublishing
        },
        handleCollabAdd(user) {
            const { collabs } = this.form
            const alreadyAdded = collabs.find(c => c.user.id == user.id)
            if (alreadyAdded) {
                return
            }
            collabs.push({
                user,
                profit: 0,
                publishing: 0,
            })
        },
        handleCollabProfitInput(collab, e) {
            const el = e.target
            const oldValue = collab.profit
            const newValue = Math.abs(Number(el.value))

            if (isNaN(newValue)) {
                el.value = oldValue
                return
            }

            const { collabs } = this.form
            const subCollabs = collabs.slice(1)
            const subCollabsOldTotal = subCollabs.reduce(
                (total, { profit }) => total + Number(profit),
                0
            )
            const subCollabsNewTotal = subCollabsOldTotal - oldValue + newValue

            if (subCollabsNewTotal > 100) {
                el.value = oldValue
                this.$toast.error(
                    'Main collaborator profit share cannot be less than 0%.'
                )
            } else {
                const mainCollab = collabs[0]
                mainCollab.profit = 100 - subCollabsNewTotal
                collab.profit = newValue
            }
        },
        handleCollabPublishingInput(collab, e) {
            const el = e.target
            const oldValue = collab.publishing
            const newValue = Math.abs(Number(el.value))

            if (isNaN(newValue)) {
                el.value = oldValue
                return
            }

            const { collabs } = this.form
            const subCollabs = collabs.slice(1)
            const subCollabsOldTotal = subCollabs.reduce(
                (total, { publishing }) => total + Number(publishing),
                0
            )
            const subCollabsNewTotal = subCollabsOldTotal - oldValue + newValue

            if (subCollabsNewTotal > 100) {
                el.value = oldValue
                this.$toast.error(
                    'Main collaborator publishing share cannot be less than 0%.'
                )
            } else {
                const mainCollab = collabs[0]
                mainCollab.publishing = 100 - subCollabsNewTotal
                collab.publishing = newValue
            }
        },
    },
}
