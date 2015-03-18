$('#productList').on('click', 'a.del', deleteEntry);
$('#btnNewItem').on('click', addEntry);

function addEntry(event) {
	event.preventDefault();
	barcode = $('input#barcode').val()
	if(barcode === ''){
		alert('Please enter a barcode');
	} else {
		console.log(barcode)
		var newItem = {
		'products':[{
			'barcode':barcode
			}]
		}
		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(newItem),
			url: '/api/products',
			dataType: 'JSON'
		}).fail(function() {
				alert("Error adding product. Barcode might not exist.")
		}).done(function( response ) {
				location.reload(true);
		});
	}
}

// Delete User
function deleteEntry(event) {

	event.preventDefault();

	// Pop up a confirmation dialog
	//var confirmation = confirm('Are you sure you want to delete this user?');

	// Check and make sure the user confirmed
	//if (confirmation === true) {

	// If they did, do our delete
	$.ajax({
		type: 'DELETE',
		url: '/api/products/' + $(this).attr('rel')
	}).done(function( response ) {
		location.reload(true);
	});

	// }
	// else {
	// 	// If they said no to the confirm, do nothing
	// 	return false;
	//
	// }

};
