import HomePage from '../pages/home.f7'
import WorkIndex from '../pages/work/index-work.f7'
import FormWork from '../pages/work/form-work.f7'
import FormUpdateWork from '../pages/work/form-update-work.f7'
import FormInvoiceWork from '../pages/work/form-invoice-work.f7'
import ShowWork from '../pages/work/show-work.f7'
import ShowUser from '../pages/user/show-user.f7'
import FormUpdateUser from '../pages/user/form-update-user.f7'
import ClientsIndex from '../pages/clients/index-clients.f7'
import FormClient from '../pages/clients/form-client.f7'
import ShowClient from '../pages/clients/show-client.f7'
import FormUpdateClient from '../pages/clients/form-update-client.f7'
import FormRegister from '../pages/user/form-user.f7'
import ShowCalendar from '../pages/calendar/show-calendar.f7'
import IndexInvoices from '../pages/product-invoices/index-invoices.f7'
import NotFoundPage from '../pages/404.f7'

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/register/',
    component: FormRegister,
  },
  {
    path: '/prestation/',
    component: WorkIndex,
  },
  {
    path: '/mon-compte/',
    component: ShowUser,
  },
  {
    path: '/mon-compte/update/:userId',
    component: FormUpdateUser,
  },
  {
    path: '/form-work/',
    component: FormWork,
  },
  {
    path: '/form-work/update/:prestationId',
    component: FormUpdateWork,
  },
  {
    path: '/form-work/invoice/:prestation/:clientId',
    component: FormInvoiceWork,
  },
  {
    path: '/prestation/:prestationId',
    component: ShowWork,
  },
  {
    path: '/clients/',
    component: ClientsIndex,
  },
  {
    path: '/form-client/',
    component: FormClient,
  },
  {
    path: '/client/:clientId',
    component: ShowClient,
  },
  {
    path: '/form-client/update/:clientId',
    component: FormUpdateClient,
  },
  {
    path: '/calendar/',
    component: ShowCalendar,
  },
  {
    path: '/product/invoices/',
    component: IndexInvoices,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
]

export default routes
