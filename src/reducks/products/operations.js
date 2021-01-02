import { push } from "connected-react-router"
import { db, FirebaseTimestamp } from "../../firebase"
import {deleteProductAction,fetchProductsAction} from "./actions";

const productsRef = db.collection('products');

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    productsRef.doc(id).delete()
      .then(() => {
        const prevProducts = getState().products.list;
        const nextProducts = prevProducts.filter(product => product.id !== id)
        dispatch(deleteProductAction(nextProducts))
      })
  }
}

export const fetchProducts = () => {
  return async (dispatch) => {
    productsRef.orderBy('updated_at', 'desc').get()
      .then(snapshots => {
        const ProductList = []
        snapshots.forEach(snapshot => {
          const product = snapshot.data();
          ProductList.push(product)
        })
        dispatch(fetchProductsAction(ProductList));
      })
  }
}

export const saveProduct = (id, name, description, price, images) => {
  return async (dispatch) => {
    const timestamp = FirebaseTimestamp.now()

    const data = {
      description: description,
      name: name,
      price: parseInt(price, 10),
      images: images,
      updated_at: timestamp
    }

    if (id === "") {
    const ref = productsRef.doc()
    id = ref.id
    data.id = id
    data.created_at = timestamp
    }

    return productsRef.doc(id).set(data, {merge: true})
      .then(() => {
        dispatch(push('/'))
      }).catch((error) => {
        throw new Error(error)
      })
  }
}