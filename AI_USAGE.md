


# Overode the AI

   In the add cart flow , we passing the array of items in the loop , suppose we adding the 3 items 
   so the payload will be like this 
   {
  "sessionId": "order-session-3",
  "items":[
    {
        "productId": "6a866209e57117723800bb02",
         "quantity": 1
    }
     {
         "productId":"6a833689f183ab5edac74c25",
        "quantity":1
    },
      {
         "productId":"6a833689f183ab5edac74c23",
        "quantity":2
     }
  ]
}    so those we items we passing as in the loop one by one 
     first product was added in the stock
     second product was not  added , not in the stock failed 
     third product was in the stock but not added

     this above AI has given , adding first product in the cart not use is the worse case why third product was not added kind of questions raised? I approached my self with the fallback mechanism , if any of the product out of stock the entire operation will failed no one will be added in the cart that is the case I  implemented myself