import { defineStorage } from "@aws-amplify/backend";
import { generateThumb } from '../functions/resize/resource'

export const imagesStorage = defineStorage({
  name: "images",
  access: (allow) => ({
    'originals/*': [
      allow.resource(generateThumb).to(['read', 'write', 'delete'])
    ],
    'thumbs/*': [
      allow.resource(generateThumb).to(['read', 'write', 'delete'])
    ]
  })
});