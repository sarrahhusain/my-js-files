function downloadBlobUrl(url, mimetype) {
	var customRevokeObjectURL = URL.revokeObjectURL;
	console.log('Overriding URL.revokeObjectURL');
	URL.revokeObjectURL = function (url) {};
	console.log('Current URL:', window.location.href);

	var currentUrl = window.location.href;
	var fileName = '';
	var fileExtension = '';

	if (currentUrl.startsWith('http://10.24.0.157/operation/')) {
		console.log('Matched URL pattern: Bagging or Manifest');
		if (document.querySelector("#BaggingSealId") !== null && document.querySelector("#BaggingSealId") !== undefined) {
			fileName = 'baglabel_' + Date.now();
			fileExtension = 'prn';
		} else if (document.querySelector("#scanUnitLabel") !== null && document.querySelector("#scanUnitLabel") !== undefined) {
			fileName = 'manifest_' + Date.now();
			fileExtension = 'pdf';
		}
	} else if (currentUrl.startsWith('http://10.24.1.71/mh-ops/irt-area/label-print')) {
		console.log('Matched URL pattern: Label Print');
		fileName = 'shipments_' + Date.now();
		fileExtension = 'zip';
	} else if (currentUrl.startsWith('http://flolite-prod.fsg-assets-tech.fkcloud.it/reprint')) {
		console.log('Matched URL pattern: Reprint');
		fileName = 'wid_' + Date.now();
		fileExtension = 'prn';
	} else if (currentUrl.startsWith('http://fbd.portalonewifi.com/eebrowser.html')) {
		console.log('Matched URL pattern: Portal One WiFi');
		fileName = 'test_file_'+ Date.now();
		fileExtension = 'prn';
	} else {
		fileName = 'downloadfile';
		fileExtension = window.surefox.getDefaultExtension();
	}

	if (!fileName || !fileExtension) {
		console.log('No valid fileName or fileExtension found. Revoking URL:', url);
		customRevokeObjectURL.call(URL, url);
	}

	console.log('Creating XHR request');
	var xhr = new XMLHttpRequest();
	console.log('XHR request URL:', url);
	xhr.open('GET', url, true);
	xhr.setRequestHeader('Content-type', mimetype + ';charset=UTF-8');
	xhr.responseType = 'blob';

	xhr.onload = function () {
		console.log('XHR onload triggered, Status:', this.status);
		if (this.status === 200) {
			var blobFile = this.response;
			var reader = new FileReader();
			reader.readAsDataURL(blobFile);
			reader.onloadend = function () {
				var base64data = reader.result;
				window.surefox.getBase64FromBlobData(base64data, mimetype, fileName, fileExtension);
				customRevokeObjectURL.call(URL, url);
			};
		} else {
			console.log('XHR failed. Status:', this.status);
		}
	};

	xhr.onerror = function (e) {
		console.log('XHR request failed! Status:', e.target.status);
		customRevokeObjectURL.call(URL, url);
	};

	xhr.send();
	console.log('XHR request sent');

}

