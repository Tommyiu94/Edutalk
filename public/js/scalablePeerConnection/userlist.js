function Node(userName) {
	this.userName = userName;
	this.next = null;
}

function UserList() {
	this._length = 0;
	this.head = null;
}

UserList.prototype.addUser = function(userName, successCallback, failCallback) {
	try {
		var node = new Node(userName);
		var currentNode = this.head;

		if (!currentNode) {
			this.head = node;
			this._length++;
			successCallback(null, node.userName);
		}else {
			while (currentNode.next) {			
				parentNode = currentNode;
				currentNode = currentNode.next;
			}		
			currentNode.next = node;
			this._length++;
			successCallback(node.userName, currentNode.userName);
		}
	}catch (e){
		console.log(e);
		failCallback();
	}
};

UserList.prototype.deleteUser = function(userName, successCallback, failCallback) {
	var currentNode = this.head;
	var parentNode = currentNode;
	if (userName === currentNode.userName){
		this.UserList = null;
		failCallback();
	}

	while (userName !== currentNode.userName) {
		parentNode = currentNode;
		currentNode = currentNode.next;
	}

	parentNode.next = currentNode.next;
	currentNode = null;
	successCallback(parentNode.next.userName, parentNode.userName);
};

module.exports = new UserList();