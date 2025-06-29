export interface FormPageInteface {
  send(): Promise<void>
  initForm(): void | Promise<void>
  getPageTitle(): string
  getBlockTitle(): string
}
