<?php
	$dir_upload = 'pictures/';
	$file_upload = $dir_upload . basename($_FILES['picture']['name']);
	move_uploaded_file($_FILES['picture']['tmp_name'], $file_upload);
	
	header('Content-Type: application/json');
	die(
			json_encode(
				array(
        			'data' => 'Ok',
        			'status' => 'success'
    			)
    		)
    );
	//var_dump($_FILES);

?>