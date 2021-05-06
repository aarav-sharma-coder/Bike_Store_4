var uid = null;

AFRAME.registerComponent("marker-handler",{
    init:async function(){
        if(uid === null){
            this.askUid();
        }
        var bikes = await this.getBikes()
        this.el.addEventListener("markerFound",()=>{
            if(uid !== null){
            var markerId = this.el.id;
            this.handleMarkerFound(bikes ,markerId);
            }
        });
    
        this.el.addEventListener("markerLost",()=>{
            console.log("Marker Lost");
            this.handleMarkerLost();
        });
    },
    askUid: function(){
        var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
        swal({
            title: "Welcome",
            icon: iconUrl,
            content:{
                element: "input",
                attributes:{
                    placeHolder: "Type your uid",
                    type: "number",
                    min:1
                }
            },
            closeOnClickOutside: false,
        }).then(inputvalue=>{
            uid = inputvalue;
        })
    },
    handleMarkerLost: function(){
        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "none";
    },
    handleMarkerFound: function(bikes, markerId){

        var todaysDate = new Date();
        var todaysDay = todaysDate.getDay();
        
        var days=[
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"
        ]

        var bike = bikes.filter(bike=> bike.id===markerId)[0]
        var model = document.querySelector(`#model-${dish.id}`);
        model.setAttribute("visible", true);

        var ingredientsContainer = document.querySelector(`#main-plane-${bike.id}`);
        ingredientsContainer.setAttribute("visible", true);

        var priceplane = document.querySelector(`#price-plane-${bike.id}`);
        priceplane.setAttribute("visible", true)

        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "flex";
        if(dish.unavailable_days.include(days[todaysDay])){
            swal({
              icon: "warning",
              title: dish.dish_name.toUpperCase(),
              text: "This dish is not available today",
              timer: 2500,
              buttons: false
            });
          }else{
            var model = document.querySelector(`#model-${dish.id}`);
            model.setAttribute("position", bike.model_geometry.position);
            model.setAttribute("rotation", bike.model_geometry.rotation);
            model.setAttribute("scale", bike.model_geometry.scale);
          }
        var on = document.getElementById("onb");
        var os = document.getElementById("osb");

        on.addEventListener("click",()=>{
            var ui;
            uid<=9 ? (ui = `U0${uid}`) : ui=`U${uid}`
            this.handleOrder(ui,bike)
            swal({
                icon: "https://i.imgur.com/4NZ6uLY.jpg",
                title: "Bike ordered",
                text: "Your bike will be delivered in 2 weeks.",
                timer: 2000,
                buttons:false
            })
        });
        if(uid !== null){
            os.addEventListener("click",()=>{
            swal({
                icon: "warning",
                title: "Order Summary",
                text: "Work in progress"
            })
        })
}
    
    },
    handleOrder: function(ui,bike){
        firebase.firestore().collection('bikes').doc(ui).get().then(doc=>{
            var details = doc.data();
      
            if(details["current_orders"][bike.id]){
              details["current_orders"][bike.id]['quantity']+=1;
      
              var currentQuantity = details["current_orders"][bike.id]["quantity"]
              details["current_orders"][bike.id]["subTotal"]=currentQuantity*bike.price
      
            }else {
                details["current_orders"][bike.id] = {
                  item: bike.bike_name,
                  price: bike.price,
                  quantity: 1,
                  subtotal: bike.price * 1
                };
              }
      
              details.total_bill += bike.price;
      
              //Updating db
              firebase
                .firestore()
                .collection("tables")
                .doc(doc.id)
                .update(details);
            });
    },
    getBikes: async function(){
        return await firebase.
                     firestore()
                     .collection('bikes')
                     .get()
                     .then(snap=>{
                         return snap.docs.map(doc=>doc.data());
                     })
    }
})