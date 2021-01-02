import { push } from "connected-react-router"
import { db, FirebaseTimestamp } from "../../firebase"

const productsRef = db.collection('products')

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