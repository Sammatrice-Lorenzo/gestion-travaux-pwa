import type Framework7 from 'framework7'
import type { PhotoBrowser } from 'framework7/types'
import type WorkImageInteface from '../../../intefaces/WorkImage/WorkImageInterface'
import type WorkImageService from '../../WorkImageService'
import { CONFIRMATION_TO_DELETE } from '../../messages'

export default class WorkImageBrowserService {
  constructor(
    private _app: Framework7,
    private _workImageService: WorkImageService,
  ) {}

  private _workImages: WorkImageInteface[]

  public async showImagesInPhotoBrowser(): Promise<PhotoBrowser.PhotoBrowser | null> {
    this._workImages = await this._workImageService.getWorkImagesByWork()

    if (this._workImages.length < 1) {
      this._app.dialog.alert("Il n'y a pas d'images pour cette prestation !")

      return null
    }

    const thumbs = this._workImages.map(
      (photo: WorkImageInteface) =>
        // @ts-ignore
        `${API_URL}/work-images/${photo.imageName}`,
    )

    const photoBrowser: PhotoBrowser.PhotoBrowser =
      this._app.photoBrowser.create({
        photos: thumbs,
        thumbs: thumbs,
        type: 'page',
        renderToolbar: () => `
        <div class="toolbar toolbar-bottom">
          <div class="toolbar-inner justify-content-end">
            <div class="right">
              <a href="#" class="link delete-photo">
                <i class="f7-icons text-color-red">trash</i>
              </a>
            </div>
          </div>
        </div>
        `,
      })
    this.handelDeletePhoto(photoBrowser)

    return photoBrowser
  }

  public handleUpdateNavbar(): void {
    const elementCoutPhoto = document.getElementsByClassName(
      'photo-browser-of',
    )[0] as HTMLElement | undefined
    if (elementCoutPhoto) {
      elementCoutPhoto.outerText = ' sur '
    }

    const back: HTMLElement | null = document.querySelector(
      '.navbar-photo-browser span',
    )
    if (back && back.outerText === 'Back') {
      back.outerText = ' Retour'
    }
  }

  public handelDeletePhoto(photoBrowser: PhotoBrowser.PhotoBrowser): void {
    photoBrowser.on('open', () => {
      this.handleUpdateNavbar()
      const buttonsTrash: NodeListOf<Element> =
        document.querySelectorAll('.delete-photo')
      for (const button of buttonsTrash) {
        button.addEventListener('click', async (e: Event) => {
          e.preventDefault()
          await this.deletePhoto(photoBrowser)
        })
      }
    })
  }

  private async deletePhoto(
    photoBrowser: PhotoBrowser.PhotoBrowser,
  ): Promise<void> {
    const photo = this.getPhotoToDelete(photoBrowser)
    this._app.dialog.confirm(CONFIRMATION_TO_DELETE, async () => {
      await this._workImageService.deleteWorkImage(photo?.id)
    })
  }

  private getPhotoToDelete(
    photoBrowser: PhotoBrowser.PhotoBrowser,
  ): WorkImageInteface | undefined {
    const index = photoBrowser.activeIndex
    // @ts-ignore
    let photoToDelete: WorkImageInteface | undefined
    if (photoBrowser.params.photos) {
      const imageName: string | PhotoBrowser.Photo =
        photoBrowser.params?.photos[index]
      const name: string = imageName
        .toString()
        // @ts-ignore
        .replace(`${API_URL}/work-images/`, '')

      photoToDelete = this._workImages
        .filter((photo) => photo.imageName === name)
        .shift()
    }

    return photoToDelete
  }
}
