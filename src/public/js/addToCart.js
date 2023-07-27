function addToCart(cartId, productId) {
  
    const quantity = parseInt(document.getElementById(`quantity${productId}`).value, 10);
  
      fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cantidad: quantity })
      })
        .then(async response => {
          if (response.ok) {
            return response.json();
          } else {
            const data = await response.json();
            return await Promise.reject(data.error);
          }
        })
        .then(data => {
          alert("producto agregado al carrito")
          console.log(data);
        })
        .catch(error => {
          alert("Error: " + error)
        });
}