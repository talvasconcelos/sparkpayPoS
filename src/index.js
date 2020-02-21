import './style'
import { I18nContextProvider} from './i18n'
import App from './components/app'

const Pos = () => (
    <I18nContextProvider>
        <App />
    </I18nContextProvider>
)

export default Pos
