$("input[name='search']").keyup(function() {
  var search = $("input[name='search']").val();
  console.log(search);
  $.get('/books?search=' + search, function(data) {
    console.log(JSON.stringify(data));
    $('#book-grid').html('');
    data.forEach(function(book) {
      $('#book-grid').append(`
        <div class="col-md-2 col-sm-6">
          <div class="thumbnail">
            <img src="${ book.links.img }">
            <div class="caption">
              <h5>${ book.title }</h5>
            </div>
          </div>
        </div>
      `);
    });
  });
});

// $('#books-search').on('#srch', function() {
//   console.log("key pressed");
//   var search = $(this).serialize();
//   if(search === "search=") {
//     search = "all"
//   }
//   $.get('/books?' + search, function(data) {
//     console.log(data);
//     $('#book-grid').html('');
//     data.forEach(function(book) {
//       $('#book-grid').append(`
//         <div class="col-md-3 col-sm-6">
//           <div class="thumbnail">
//             <img src="${ book.links.img }">
//             <div class="caption">
//               <h5>${ book.title }</h5>
//             </div>
//           </div>
//         </div>
//       `);
//     });
//   });
// });

$('#book-search').submit(function(event) {
  event.preventDefault();
});