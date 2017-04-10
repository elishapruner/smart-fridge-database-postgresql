$(document).ready(function() {
  $('.delete-order').on('click', function() {
    var id = $(this).data.id;
    console.log(id);
    console.log('test');
  });
});