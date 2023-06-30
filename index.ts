import * as AC from "adaptivecards"
import { AutoComplete } from "./src/autoComplete"

AC.GlobalRegistry.defaultElements.register(AutoComplete.JsonTypeName, AutoComplete)

export { AC as AdaptiveCards }