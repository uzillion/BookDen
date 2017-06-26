$('#books-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/books?' + search, function(data) {
    $('#book-grid').html('');
    data.forEach(function(book) {
      $('#book-grid').append(`
        <div class="col-md-3 col-sm-6">
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

$('#book-search').submit(function(event) {
  event.preventDefault();
});