import * as AC from "adaptivecards"
import { AutoComplete } from "./autoComplete"

AC.GlobalRegistry.defaultElements.register(AutoComplete.JsonTypeName, AutoComplete)

export { AC as AdaptiveCards }