export interface FormPageInteface {
  send(): void
  initForm(): void | Promise<void>
  getPageTitle(): string
  getBlockTitle(): string
}
