import type { ChatCompletionTool } from 'groq-sdk/resources/chat/completions';

export const CHAT_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_products',
      description:
        'Search active, in-stock products using a natural-language query and optional maximum price.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'What the customer is looking for, for example "running shoes".',
          },
          maxPrice: {
            type: ['number', 'null'],
            description:
              'Maximum product price. Use null when the customer did not specify one.',
          },
        },
        required: ['query', 'maxPrice'],
        additionalProperties: false,
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'add_to_cart',
      description:
        'Add one or more products to the current cart. Use only product IDs returned by search_products.',
      parameters: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                },
                quantity: {
                  type: 'integer',
                  minimum: 1,
                },
              },
              required: ['productId', 'quantity'],
              additionalProperties: false,
            },
          },
        },
        required: ['items'],
        additionalProperties: false,
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'get_cart_summary',
      description:
        'Get the current cart, items, subtotal, discount code and status.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'apply_discount',
      description:
        'Apply a discount code to the current cart. The backend calculates the subtotal and checks eligibility.',
      parameters: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Discount code provided by the customer.',
          },
        },
        required: ['code'],
        additionalProperties: false,
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'confirm_order',
      description:
        'Place the current order after the customer has explicitly confirmed the final order.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
];