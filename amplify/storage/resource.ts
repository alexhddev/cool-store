import { defineStorage, defineFunction } from "@aws-amplify/backend";
import {  generateThumb } from '../functions/resize/resource'

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
  name: "images"
});