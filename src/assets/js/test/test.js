QUnit.test( "deepEqual test", function( assert )
{
  assert.expect( 3 );

  var doc = $( document );
  var keys = new KeyLogger( doc );
  var arrResponse = $.parseJSON(enviaArchivo(1,0,0));


  //console.log(arrResponse['idUpload']);



  var idUpload = arrResponse['idUpload'];

  arrResponse['idUpload'] = 'Auto generated unique code';

  var arrCompare = $.parseJSON("{\"nombreArchivo\":null,\"URLarchivo\":null,\"ext\":null,\"error\":1,\"idUpload\":\"13uscd8jow0rr3w3kgv6f3r\",\"porcentaje\":0}", "Two objects can be the same in value");

  arrCompare['idUpload'] = 'Auto generated unique code';

  assert.deepEqual( arrResponse,  arrCompare);

  var done = assert.async();
  var input = $( "fileupload" ).focus();

  var arrResponse = $.parseJSON(enviaArchivo(1,0,idUpload));
  doc.trigger( $.Event( "keydown", { keyCode: 13 }));
  assert.equal( document.activeElement, input[0], "Input was focused" );
  done();
  assert.deepEqual( arrResponse['nombreArchivo'], null, "null, false; equal fails" );
});

function KeyLogger( target ) {
  this.target = target;
  this.log = [];

  var that = this;
  this.target.off( "keydown" ).on( "keydown", function( event ) {
    that.log.push( event.keyCode );
  });
}

QUnit.test( "asynchronous test: async input focus", function( assert ) {

});
