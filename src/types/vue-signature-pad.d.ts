/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vue-signature-pad' {
  import type { DefineComponent } from 'vue'

  const VueSignaturePad: DefineComponent<
    Record<string, unknown>,
    {
      clearSignature: () => void
      saveSignature: () => { isEmpty: boolean; data: string }
    },
    any
  >

  export default VueSignaturePad
}
