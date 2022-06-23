var room_count=1;
const center = { lat: 50.064192, lng: -130.605469 };
let rooms_data = {};
const defaultBounds = {
  north: center.lat + 0.1,
  south: center.lat - 0.1,
  east: center.lng + 0.1,
  west: center.lng - 0.1,
};
const input = document.getElementById("location");
const options = {
  bounds: defaultBounds,
  componentRestrictions: { country: "in" },
  fields: ["address_components", "geometry", "icon", "name"],
  strictBounds: false,
  types: ["establishment"],
};
const autocomplete = new google.maps.places.Autocomplete(input, options);


function increase_count(input_id){
  let input = document.getElementById(input_id);
  input.value = parseInt(input.value) + 1
}

function decrease_count(input_id){
  let input = document.getElementById(input_id);
  if (!((parseInt(input.value) - 1)< parseInt(input.min))){
      input.value = parseInt(input.value) - 1
  }
}

function remove(){
  let delete_button = document.getElementById("delete");
  if(room_count>1){
      const room = document.getElementById("room"+room_count);
      const line = document.getElementById("line"+room_count);
      room.remove();    
      line.remove();   
      room_count-=1;
      if(room_count==1){   
          delete_button.style.display = "none";
      }
  }
  else{
      delete_button.style.display = "none";
  }
}

function update_data(){
  let room_count_display = document.getElementById("room-count");
  let guest_count_display = document.getElementById("guest-count");
  let rooms = document.getElementById("rooms-text");
  let guests = document.getElementById("guests-text");
  let sum=0
  for(let i=1; i<=room_count;i++){
    let adult = document.getElementById("adult_"+String(i));
    let child = document.getElementById("child_"+String(i));
    sum=sum+parseInt(adult.value);
    sum=sum+parseInt(child.value);

  }
  room_count_display.innerText = room_count;
  guest_count_display.innerText = sum;

  if(room_count>1)
  {
    rooms.innerText = "Rooms ";
  }
  else
  {
    rooms.innerText = "Room ";
  }

  if(sum>1)
  {
    guests.innerText = "Guests";
  }
  else
  {
    guests.innerText = "Guest";
  }
}

function pop_up_submit(event){
  event.preventDefault();
    toggle();   
    update_data();

    event.preventDefault();
    rooms_data = {};
    let form = new FormData(document.getElementById("pop-up-form"));
    for (var pair of form.entries()) {
      rooms_data[pair[0]] = pair[1];
  }
  
  }


function toggle()
{
  let test = document.getElementById("rooms_and_adults");

  let form_test = document.getElementById("search_form");
  if(test.style.display == 'block'){
    test.style.display = 'none';
    search_form.style.filter = "blur(0)";
  }
  else{
    test.style.display = 'block';
    search_form.style.filter = "blur(0.5px)";

  }
 
}


function add_room(){
  room_count+=1;
  let delete_button = document.getElementById("delete");
  let form = document.getElementById("add_more_room");
  html = '<hr id = "line' + room_count + '"><div id="room'+room_count+'" class="add_room">\
              <label for="room1" class="room-label">ROOM '+room_count+'</label>\
              <div class="flex-1">\
              <div class="adult">\
                  <span>ADULTS (12y +)</span>\
                  <input type="number" id="adult_'+room_count+'" placeholder="No. of Adults"  min="1" value="1" class="count-input"\
                  name="room_'+room_count+'_adults"\
                  />\
                  <button type="button" onclick="increase_count(\'adult_'+room_count+'\')" value="fefe"\
                  >\
                  +\
                  </button>\
                  <button type="button" onclick="decrease_count(\'adult_'+room_count+'\')"> - </button>\
              </div>\
              <div class="child">\
                    <span>CHILDREN (Age 12y and below)</span>\
                    <input\
                      type="number"\
                      id="child_' + room_count+'" placeholder="No. of Children" min="0" value="0" class="count-input"\
                      name="room_' + room_count + '_children"\
                    />\
                    <button\
                      type="button" onclick="increase_count(\'child_' + room_count+'\')" "\
                    >\
                      +\
                    </button>\
                    <button type="button" onclick="decrease_count(\'child_' + room_count + '\')">\
                      -\
                    </button>\
                  </div>\
              </div>\
          </div>' 
  form.innerHTML+=html;
  delete_button.style.display = "block";
}


window.addEventListener('click', function(e){   
    let object = document.getElementById("adults-box");
    let test = document.getElementById("rooms_and_adults");
    if (test.contains(e.target)==false && object.contains(e.target)==false && test.style.display=="block"){
        toggle();
    }
  });

  function submit_search(event){
    event.preventDefault();
    let form = new FormData(document.getElementById("search_form"));
    let date_flexible = document.getElementById("date-flexible");
    if(!form.get("in_date") || !form.get("out_date")){
        alert("!! Please Select Appropriate Date !!");
    }
    else if(form.get("in_date") >= form.get("out_date"))
    {
      alert("!! Check in Date must be greater than Check out Date !!");
    }

    else{
        let final_output = {}
        final_output["location"] = form.get("location");
        final_output["check_in_date"] = form.get("in_date");
        final_output["check_out_date"] = form.get("out_date");
        
        final_output["rooms_data"] = rooms_data;
        extra_filters = []
        if(form.get("free_cancellation"))
        extra_filters.push("free_cancellation")
        if(form.get("breakfast_available"))
        extra_filters.push("breakfast_available")
        if(form.get("homestays"))
        extra_filters.push("homestays")
        if(extra_filters.length >=1)
        final_output["extra_filters"] = extra_filters;
        console.log(final_output)
    }

}