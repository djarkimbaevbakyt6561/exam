import styles from './Checkout.module.css'
import { LoadingIcon } from './Icons'
import { getProductsRequest } from './dataService'
import { useEffect } from 'react'
import { checkoutActions, getProducts } from '../store/checkout'
import { useDispatch, useSelector } from 'react-redux'

const Product = ({
    id,
    name,
    availableCount,
    price,
    orderedQuantity,
    total,
}) => {
    const dispatch = useDispatch()
    function incrementHandler() {
        dispatch(checkoutActions.incrementHandler(id))
    }
    function decrementHandler() {
        dispatch(checkoutActions.decrementHandler(id))
    }
    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{availableCount}</td>
            <td>${price}</td>
            <td>{orderedQuantity}</td>
            <td>${total.toFixed(2)}</td>
            <td>
                <button
                    onClick={incrementHandler}
                    className={styles.actionButton}
                >
                    +
                </button>
                <button
                    onClick={decrementHandler}
                    className={styles.actionButton}
                >
                    -
                </button>
            </td>
        </tr>
    )
}

const Checkout = () => {
    const checkout = useSelector((state) => state.checkout)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getProducts()).catch((error) => {
            dispatch(checkoutActions.errorHandler(error))
        })
    }, [])
    useEffect(() => {
        dispatch(checkoutActions.getTotalPrice())
    }, [checkout.products])
    console.log(checkout.products)
    return (
        <div>
            <header className={styles.header}>
                <h1>Electro World</h1>
            </header>
            <main>
                {checkout.isLoading ? null : <LoadingIcon />}
                {checkout.isError && (
                    <h4 style={{ color: 'red' }}>Some thing went wrong</h4>
                )}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th># Available</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {checkout.products?.map((el) => {
                            return (
                                <Product
                                    name={el.name}
                                    price={el.price}
                                    id={el.id}
                                    availableCount={el.availableCount}
                                    total={el.total}
                                    orderedQuantity={el.orderedQuantity}
                                    key={el.id}
                                />
                            )
                        })}
                    </tbody>
                </table>
                <h2>Order summary</h2>
                <p>Discount: $ {checkout.discount.toFixed(2)}</p>
                <p>Total: $ {checkout.totalPrice.toFixed(2)}</p>
            </main>
        </div>
    )
}

export default Checkout
