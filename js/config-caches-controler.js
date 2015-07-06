
// Manages the processors list
simsoControllers.controller('ConfigCachesCtrl', 
['confService', '$scope', 
function(confService, $scope) {
	$scope.selectedCaches = [];
	$scope.conf = confService;
	$scope.baseColumnDefs = [
		{name: 'id', type: 'number', enableCellEdit: false},
		{name: 'name', type: 'string'},
		{name: 'size', displayName: 'Size (bytes)', type: 'number'},
		{name: 'access_time', displayName: 'Access time (ms)', type: 'number'},
		{
			name: 'miss_penalty',
			displayName: 'Miss Penalty',
			enableCellEdit: false,
			type: 'number'
		}
	];
	
	$scope.gridCachesOptions = {
		enableColumnResize: true,
		enableCellEdit: true,
		enableColumnMenus: false,
		enableHorizontalScrollbar: 0,
		enableVerticalScrollbar: 2,
		minRowsToShow: 4,
		columnDefs: $scope.baseColumnDefs,
		data: $scope.conf.caches,
	};
	
	// ------------------------------------------------------------------------
	// *** API Registering *** 
	// ------------------------------------------------------------------------
	$scope.gridCachesOptions.onRegisterApi = function(gridApi) {
		$scope.gridApi = gridApi;
		var updateRow = function(row) {
			if (row.isSelected) {
				$scope.selectedCaches.push(row.entity);
			} else {
				var index = $scope.selectedCaches.indexOf(row.entity);
				if (index > -1) {
					$scope.selectedCaches.splice(index, 1);
				}
			}
		};
		
		// Registers correctors
		simsoApp.correctors.register($scope, gridApi, "size", correctors.isPositiveInt);
		simsoApp.correctors.register($scope, gridApi, "access_time", correctors.isPositiveInt);
		
		gridApi.selection.on.rowSelectionChanged($scope, updateRow);
		gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows)
		{
			for(var i = 0; i < rows.length; i++) {
				updateRow(rows[i]);
			}
		});
	};
	
	// ------------------------------------------------------------------------
	// *** Add / Delete Cache *** 
	// ------------------------------------------------------------------------
	$scope.addNewCache = function() {
		var id = 1;
		for (var i = 0; i < $scope.conf.caches.length; i++) {
			if ($scope.conf.caches[i].id == id) {
				id++;
				i = 0;
			}
		}
		$scope.conf.caches.push(
		{
			 'id': id,
			 'name': 'Cache ' + id,
			 'size': 0,
			 'access_time': 0,
			 'miss_penalty': 0
		});
	};

	$scope.delCaches = function() {
		for (var i = 0; i < $scope.selectedCaches.length; i++) {
			var index = $scope.conf.caches.indexOf($scope.selectedCaches[i]);
			if (index > -1) {
				$scope.conf.caches.splice(index, 1);
			}
		}
		$scope.selectedCaches = [];
	};

	// Toggles the presence of the given cache of the proc's
	// cache list.
	$scope.toggleCache = function(proc, cache, checked) {
		if(checked) {
			// Adds the cache (if it is not yet in the cache list)
			for(var i = 0; i < proc.caches.length; i++) {
				if(proc.caches[i] == cache)
					return;
			}
			proc.caches.push(cache);
		}
		else
		{
			// Removes the cache
			for(var i = 0; i < proc.caches.length; i++) {
				if(proc.caches[i] == cache) {
					proc.caches.splice(i, 1);
					return;
				}
			}
		}
	};
	// ------------------------------------------------------------------------
	// *** Additional fields *** 
	// ------------------------------------------------------------------------

	$scope.showAdditionalFieldsModal = function() {
		$('#modalProcs').modal('show');
	};
}]);