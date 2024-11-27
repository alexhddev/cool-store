import { defineStorage, defineFunction } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplify-gen2-files",
  access: (allow) => ({
    "images/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
  isDefault: true
});

export const secondStorage = defineStorage({
  name: "amplifyTeamDrive",
});

export const imagesStorage = defineStorage({
  name: "images",
  triggers: {
    onUpload: defineFunction({
      name: "onUpload",
      entry:'./onUploadHandler.ts'

    })
  }
});