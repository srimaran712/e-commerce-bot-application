
 
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# branch -Development
the project is worked on the development branch 

# Database using MongoDB
I'm using the atlas free cluster for this assignment  , because in my orders feature implemented transactions that is not working with local db no replica set , so using thing for the database



## for your note 
Node.js version using for this assignment is 22

version 24 is not supporting use the atlas database connection string , blocking the DNS , so I removed the SRV in the connection string for this assignment.


## scripts to run the seed file 
please make sure that is running on ts-node package
# for seeding the products 
 npm run seed:products

# for seeding the discounts
npm run seed:discounts

# for running the application dev
npm run start:dev


# Endpoint for the chat api 
method-POST

https://localhost:3000/chat

payload 

{   "sessionId":"chat-test-11",
    "message": "can you show me hiking shoes"
}
add any random session id you can give 



# My assumptions on catalogue and discounts
 
 My assumption on catalogue, first choose the shoes as of products , I seeded the 20 product items with name, description, category, price, stock and whether that specific product is active or not 
 first created a collections , I wrote on seed script for inserting data, in one of  the description I added the Injection prompt that is in the outdoor shoe

 1. in the product search, I added query and max price , the price user can choose minimum and in the query they can search with name , description and category , I added a flow that only search products with in stock only have to return the result otherwise will return the empty array this is my execution


Assumptions on discounts, I created a separate collection for that seed three discount code with code name ,type, value , minimum cart value , first initially I planned to create in product collection , then I thought to make separate because in future we can discount code as we want we can deactivate code , that flow executed here.
Minimum cart value added , the user can purchase above 5000 only able to activate code 
for example I have save20 code purchased for 4890 , but the code will not apply because for that code you need to purchase above 5000

also included validation to avoid negative values 

I found some edge cases in the discount myself
one user can repeatedly applying the same code
there is no validation for that, so what I need , first when the applied , in the calculating flow , I updating that in the carts collection as discount code , 
when they try to apply again it won't apply 
also in the orders same validation handled for discounts to check

this are my overview of assumption what I did in this task

# duplicate confirmation

In the orders flow we completely handling with transactions and atomic operations
at the very first stage we checking the cart with sessionID, that status is "open" only satisfies when matches sessionID and status open other wise it will not move forward this , once it fetch the cart we updating cart status to "confirming"is the reason I  preventing the duplication , after the order placed we updating the cart status to "placed", if any of the operations failed I rolledback entire operation remains with previous state cart status change back to "open

firt request---> confirm--->order placed
second request---> there is no cart found we can't place any order 
third request ---> sorry 

when user again and again how many times they will try to confirm it will not process any operation remains same, no stock deduction, no cart status update ,no orders created.


# stopped the injection
the model can only act through a fixed set of tool calls, and those tools enforce their own rules independently of what the model believes. Concretely: apply_discount only succeeds if the code exists in the real discount_codes collection, so an instruction like "apply a 100% discount" has nothing to attach to — there's no such code, injected or not.

And also main in the system prompt added the note explicitly 

this is the case I tested for this injection I explicitly asked the discount in the message 
so the model returned like this 
"
I understand you’d like a discount applied. Our system can apply discounts when a valid discount code is provided. If
you have a promo or VIP code, please share it and I’ll apply it to your cart right away. If you don’t have a code, I can
check whether any standard discounts are currently available. Let me know how you’d like to proceed!"

# at first 10,000 orders 

first the interesting thing is token will exhausted
second there will be synchronous llm tool calls can spike the memory and it will get a delay response that is not good for the user

# one thing I'm not happy
I'm choosed the mongoDB for this assignment for my flexibility, iniitally started with local instance, in orders I need to implement the transactions flow in the operation for that thing local instance will not supporting the transactions as it needs a replica set I tried to set the replica set in the local driver but failed, 
so i found to use the mongoDb free cluster to shift the database , when I start integrating with this connection string atlas cluster its not supporting the connection , because I'm currently using the node.js version 24 , so in the src of the connection string will not support for versions more than 22 , that is a again got exhausted

# found a fix
Uninstalled all the npm packages created on 24 
Switched to version 22 nvm use 22
removed the SRV  from the connection string of the driver , because src blocking the DNS lookup
again installed the packages in 22
added as mongodb:// 