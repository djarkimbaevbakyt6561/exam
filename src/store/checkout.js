import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProductsRequest } from '../JS/dataService'

const initialState = {
    products: [],
    totalPrice: 0,
    discount: 0,
    isLoading: true,
    isError: false,
}

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        getTotalPrice: (state, action) => {
            state.totalPrice = state.products.reduce(
                (prev, current) => prev + current.total,
                0
            )
            if (state.totalPrice >= 1000) {
                state.discount = state.totalPrice.toFixed(2) / 10
            } else {
                state.discount = 0
            }
        },
        errorHandler: (state, action) => {
            state.isError = true
        },
        incrementHandler: (state, action) => {
            const updatedProducts = state.products.map((el) => {
                if (el.id === action.payload) {
                    return {
                        ...el,
                        orderedQuantity: el.orderedQuantity + 1,
                        total: Number(el.total) + el.price,
                    }
                }
                return el
            })
            state.products = updatedProducts
        },
        decrementHandler: (state, action) => {
            const updatedProducts = state.products.map((el) => {
                if (el.id === action.payload) {
                    if (el.orderedQuantity <= 0) {
                        return el
                    } else {
                        return {
                            ...el,
                            orderedQuantity: el.orderedQuantity - 1,
                            total: Number(el.total) - el.price,
                        }
                    }
                }
                return el
            })
            state.products = updatedProducts
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(getProducts.rejected, (state, action) => {
            state.isLoading = true
            state.isError = true
        })
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.isLoading = true
            state.products = action.payload.products.map((el) => {
                return { orderedQuantity: 0, total: 0, ...el }
            })
        })
    },
})

export const checkoutActions = checkoutSlice.actions
export const getProducts = createAsyncThunk(
    'checkout/getItems',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await getProductsRequest()
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
