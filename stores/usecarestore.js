import { defineStore } from "pinia";

export const useCarStore = defineStore("usecarstore", 
    {
        state: () => (
            {
            order:[],
            total: 0
            }),
        
        actions: 
        {
            addproducts(product) {
                this.order.push(product)
                this.total += product.price * product.quantity
                },
            confirmorder(){
                if(this.order.length === 0)
                {
                    alert("no agrego articulos al pedido")
                    return
                }

                let receipt = 'Recibo de Compra\n\n'
                this.order.forEach((item) => {
                  receipt += `${item.name} - ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)} MXN\n`
                })
                receipt += `\nTotal a pagar: $${this.total.toFixed(2)} MXN`
          
                alert(receipt)

                this.order = []
                this.total = 0
                
                }
        },
        persist: {
            storage: persistedState.localStorage,
          }
    }
)