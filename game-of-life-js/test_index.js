import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

const testsContext = require.context('./src', true, /.spec\.(js|jsx)?$/)
testsContext.keys().forEach(testsContext)
