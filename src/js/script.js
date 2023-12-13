class Calculadora {
    constructor(valorPrevioTextElement, valorActualTextElement) {
        this.valorPrevioTextElement = valorPrevioTextElement
        this.valorActualTextElement = valorActualTextElement
        this.borrarTodo()
        this.operacionIgual = false
        this.auxActual = ''
        this.auxPrevio = ''
        this.aggNum = undefined
    }

    borrarTodo() {
        this.valorActual = ''
        this.valorPrevio = ''
        this.operacion = undefined
        this.auxActual=''
        this.auxPrevio=''
        this.aggNum=undefined
        
    }

    borrar() {
        this.valorActual = this.valorActual.toString().slice(0, -1)
    }

    agregarNumero(numero) {
        //this.valorActual = numero
        if (numero === '.' && this.valorActual.includes('.')) return
        if (this.valorActual.length >= 11) return
        this.valorActual = this.valorActual.toString() + numero.toString()

    }

    elejirOperacion(operacion) {

        if (this.valorActual === '') return
        if (this.valorPrevio !== '') {
            this.calcular()
        }
        this.operacion = operacion

        if (this.operacion == '%') {
            this.valorPrevio = this.valorActual
            this.valorActual = parseFloat(this.valorActual) / 100

        } else {
            this.valorPrevio = this.valorActual
            this.valorActual = ''
        }

    }


    calcular() {
        let resultado
        const valor_1 = parseFloat(this.valorPrevio)
        const valor_2 = parseFloat(this.valorActual)
        if (isNaN(valor_1) || isNaN(valor_2)) return
        switch (this.operacion) {
            case '+':
                resultado = valor_1 + valor_2

                break
            case '-':
                resultado = valor_1 - valor_2
                break
            case 'x':
                resultado = valor_1 * valor_2
                break
            case '÷':
                resultado = valor_1 / valor_2
                break
            default:
                return
        }
        
        if (this.operacionIgual != false) {
            this.auxActual = this.valorActual
            this.auxPrevio = this.valorPrevio
            this.valorActual = resultado
            this.valorPrevio = ''

        } else {
            this.valorActual = resultado
            this.operacion = undefined
            this.valorPrevio = ''
        }


    }

    obtenerNumero(numero) {

        const cadena = numero.toString()
        const enteros = parseFloat(cadena.split('.')[0])
        const decimales = cadena.split('.')[1]
        let mostrarEnteros
        if (isNaN(enteros)) {
            mostrarEnteros = ''
        } else {
            mostrarEnteros = enteros.toLocaleString('en', { maximumFractionDigits: 0 })
        }

        if (decimales != null) {

            return `${mostrarEnteros}.${decimales}`
        } else {
            return mostrarEnteros
        }
    }
    
    igual() {
        this.operacionIgual = true;
    }

    validar() {
        if (this.valorPrevioTextElement.innerText == `${this.auxPrevio} ${this.operacion} ${this.auxActual}`) {
            this.aggNum = true;
            this.operacion = undefined
            this.auxActual=this.valorActual
            this.valorActual=''
            this.actualizarPantalla();
        }

    }

    actualizarPantalla() {


        if (this.operacion == "%") {
            this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual)
            this.valorPrevioTextElement.innerText = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion}`
            
        } else {


            this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual)
            if (this.operacion != undefined) {

                if (this.operacionIgual) {
                    this.valorPrevioTextElement.innerText = `${this.auxPrevio} ${this.operacion} ${this.auxActual}`
                    this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual)
                    this.operacionIgual = false
                } else {
                    this.valorPrevioTextElement.innerText = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion}`
                }
            } else {
                if (this.aggNum){
                    this.valorPrevioTextElement.innerText=`= ${this.auxActual}`

                }else{
                    this.valorPrevioTextElement.innerText = ''

                }

            }
        }
    }
}

//Captura de datos del DOM
const numeroButtons = document.querySelectorAll('[data-numero]')
const operacionButtons = document.querySelectorAll('[data-operacion]')
const igualButton = document.querySelector('[data-igual]')
const borrarButton = document.querySelector('[data-borrar]')
const borrarTodoButton = document.querySelector('[data-borrar-todo]')
const valorPrevioTextElement = document.querySelector('[data-valor-previo]')
const valorActualTextElement = document.querySelector('[data-valor-actual]')

// Instanciar un nueo objeto de tipo calculadora
const calculator = new Calculadora(valorPrevioTextElement, valorActualTextElement)

numeroButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.validar()
        calculator.agregarNumero(button.innerText)
        calculator.actualizarPantalla()
    })
})

operacionButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.elejirOperacion(button.innerText)
        calculator.actualizarPantalla()
    })
})

igualButton.addEventListener('click', _button => {
    calculator.igual();
    calculator.calcular()
    calculator.actualizarPantalla()
})

borrarTodoButton.addEventListener('click', _button => {
    calculator.borrarTodo()
    calculator.actualizarPantalla()
})

borrarButton.addEventListener('click', _button => {
    calculator.borrar()
    calculator.actualizarPantalla()
})

/*Parcial:
1. Arreglar bug que limite los numeros en pantalla
2. Funcionabilidad de boton de porcentaje
3. Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
4. Muestre la operacion completa en el display superior
*/