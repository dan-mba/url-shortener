$(function(){
  $("#shortErr").hide();
  $("#shortUrl").hide();
  $("form").submit(function(event) {
    event.preventDefault();
    $.ajax({
      url: $("form").attr('action'),
      type: 'POST',
      data: $("form").serialize(),
      success: function(data){
        if (!data.error) {
          $("#shortErr").hide();
          var url = window.location.origin + "/api/shorturl/" + data.new_url;
          $("#shortUrl").text(url);
          $("#shortUrl").attr('href',url);
          $("#shortUrl").show();
        } else {
          $("#shortErr").show();
          $("#shortUrl").hide();
        }
      }
    });
  });
});