import * as AC from "adaptivecards";
import { StringProperty, NumProperty, StringArrayProperty } from "adaptivecards"

export class AutoComplete extends AC.CardElement {
    static readonly JsonTypeName = "AutoComplete";

    //#region Schema

    static readonly titleProperty = new StringProperty(AC.Versions.latest, "title", true);
    static readonly optionsProperty = new StringArrayProperty(AC.Versions.latest, "options");
    static readonly placeHolderProperty = new StringProperty(AC.Versions.latest, "placeHolder", true);
    static readonly valueProperty = new NumProperty(AC.Versions.v1_0, "value");

    @AC.property(AutoComplete.titleProperty)
    get title(): string | undefined {
        return this.getValue(AutoComplete.titleProperty);
    }

    set title(value: string) {
        if (this.title !== value) {
            this.setValue(AutoComplete.titleProperty, value);

            this.updateLayout();
        }
    }

    @AC.property(AutoComplete.optionsProperty)
    get options(): string[] {
        return this.getValue(AutoComplete.optionsProperty);
    }

    set optioins(value: string[]) {
        this.setValue(AutoComplete.optionsProperty, value);

        this.updateLayout();
    }

    @AC.property(AutoComplete.placeHolderProperty)
    get placeHolder(): string {
        return this.getValue(AutoComplete.placeHolderProperty);
    }

    set placeHolder(value: string) {
        if (this.placeHolder !== value) {
            this.setValue(AutoComplete.placeHolderProperty, value);

            this.updateLayout();
        }
    }


    @AC.property(AutoComplete.valueProperty)
    get value(): string {
        return this.getValue(AutoComplete.valueProperty);
    }

    set value(value: string) {
        if (this.value !== value) {
            this.setValue(AutoComplete.valueProperty, value);

            this.updateLayout();
        }
    }

    //#endregion

    private _titleElement: HTMLElement | undefined;
    private _inputElement: HTMLInputElement | undefined;
    private currentFocus: number = 0;
    protected internalRender(): HTMLElement {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        .ac-autocomplete {
            /*the container must be positioned relative:*/
            position: relative;
            display: flex;
          }
         .ac-autocomplete-input {
            border: 1px solid #dddddd;
            padding: 4px 8px 4px 8px;
            font-size: 16px;
            flex: 1 1 auto;
            height: 31px;
          }
          
          .ac-autocomplete-items {
            position: absolute;
            border: 1px solid #d4d4d4;
            border-bottom: none;
            border-top: none;
            z-index: 99;
            /*position the autocomplete items to be the same width as the container:*/
            top: 100%;
            left: 0;
            right: 0;
          }
          .ac-autocomplete-items div {
            padding: 10px;
            cursor: pointer;
            background-color: #fff;
            border-bottom: 1px solid #d4d4d4;
          }
          .ac-autocomplete-items div:hover {
            /*when hovering an item:*/
            background-color: #e9e9e9;
          }
          .ac-autocomplete-active {
            /*when navigating through the items using the arrow keys:*/
            background-color: DodgerBlue !important;
            color: #ffffff;
          }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);

        let element = document.createElement("div");

        let textBlock = new AC.TextBlock();
        textBlock.setParent(this);
        textBlock.text = this.title;
        textBlock.wrap = true;

        this._titleElement = textBlock.render();
        this._titleElement.style.marginBottom = "6px";

        let autocompleteDiv = document.createElement("div");
        autocompleteDiv.className = "ac-autocomplete"
        autocompleteDiv.style.width = "100%"

        this._inputElement = document.createElement("input")
        this._inputElement.type = "text";
        this._inputElement.id = this.id;
        this._inputElement.placeholder = this.placeHolder
        this._inputElement.className = "ac-autocomplete-input"

        autocompleteDiv.append(this._inputElement);
        element.append(this._titleElement, autocompleteDiv);

        this.funcAutocomplete(this.options)
        return element;
    }


    getJsonTypeName(): string {
        return AutoComplete.JsonTypeName;
    }

    updateLayout(processChildren: boolean = true) {
        super.updateLayout(processChildren);

        if (this.renderedElement) {
            // do some ui update
        }
    }

    funcAutocomplete(arr: string[]) {
        let self = this;
        /*the autocomplete function take an array of possible autocompleted values as a agrument:*/
        /*execute a function when someone writes in the text field:*/
        this._inputElement.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            self.closeAllLists(undefined);
            if (!val) { return false; }
            self.currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "ac-autocomplete-list");
            a.setAttribute("class", "ac-autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e:any) {
                        /*insert the value for the autocomplete text field:*/
                        if (e.target.parentElement.className == "ac-autocomplete-items") {
                            self._inputElement.value = e.target.getElementsByTagName("input")[0].value;
                        } else {
                            self._inputElement.value = e.target.parentElement.getElementsByTagName("input")[0].value;
                        }
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        self.closeAllLists(undefined);
                    }.bind(self));
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        this._inputElement.addEventListener("keydown", function (e: KeyboardEvent) {
            let x: any = document.getElementById(self.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                self.currentFocus++
                /*and and make the current item more visible:*/
                self.addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                self.currentFocus--;
                /*and and make the current item more visible:*/
                self.addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (self.currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[self.currentFocus].click();
                }
            }
        }.bind(self));



    }

    addDocuemntClick() {
        let self = this;
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            self.closeAllLists(e.target);
        });
    }

    addActive(x: any) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        this.removeActive(x);
        if (this.currentFocus >= x.length) this.currentFocus = 0;
        if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[this.currentFocus].classList.add("autocomplete-active");
    }

    removeActive(x: any) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    closeAllLists(elmnt: any) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("ac-autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != this._inputElement) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
}

AC.GlobalRegistry.defaultElements.register(AutoComplete.JsonTypeName, AutoComplete);