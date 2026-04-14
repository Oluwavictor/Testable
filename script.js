(function () {

	const INTERVAL_MS = 30000; // 30 seconds
  
	// Helpers 
  
	function formatDueDate(date) {
	  return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	  });
	}
  
	function getTimeRemaining(due, isCompleted) {
	  if (isCompleted) return { 
		text: "Completed", cls: "" 
	};
  
	  const diff = due - Date.now();
	  const abs  = Math.abs(diff);
  
	  const mins  = Math.floor(abs / 60000);
	  const hours = Math.floor(abs / 3600000);
	  const days  = Math.floor(abs / 86400000);
  
	  // wen task is Overdue
	  if (diff < 0) {
		let text;
		if (mins  < 60) text = `Overdue by ${mins} minute${mins  !== 1 ? "s" : ""}`;
		else if (hours < 24) text = `Overdue by ${hours} hour${hours !== 1 ? "s" : ""}`;
		else                 text = `Overdue by ${days} day${days  !== 1 ? "s" : ""}`;
		return { text, cls: "overdue" };
	  }
  
	  // Future
	  let text, cls = "";
	  if (mins  < 60)  { 
		text = `Due in ${mins} minute${mins   !== 1 ? "s" : ""}`;  
		cls = "due-soon"; 
		}
	  else if (hours < 24) { 
		text = `Due in ${hours} hour${hours !== 1 ? "s" : ""}`;   
		cls = hours <= 6 ? "due-soon" : ""; 
		}
	  else if (days  < 7)  { 
		text = `Due in ${days} day${days   !== 1 ? "s" : ""}`;  
		cls = days  <= 2 ? "due-soon" : ""; 
		}
	  else {
		const weeks = Math.floor(days / 7);
		text = `Due in ${weeks} week${weeks !== 1 ? "s" : ""}`;
	  }
  
	  return { text, cls };
	}
  
	// update
  
	function update() {
	  const card      = document.querySelector('[data-testid="test-todo-card"]');
	  const checkbox  = document.querySelector('[data-testid="test-todo-complete-toggle"]');
	  const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');
	  const timeEl    = document.querySelector('[data-testid="test-todo-time-remaining"]');
	  const statusEl  = document.querySelector('[data-testid="test-todo-status"]');
  
	  if (!dueDateEl || !timeEl) return;
  
	  const due = new Date(dueDateEl.getAttribute("data-due"));
	  const isCompleted = checkbox ? checkbox.checked : false;
  
	  // Due date label
	  dueDateEl.textContent = "Due " + formatDueDate(due);
	  dueDateEl.setAttribute("datetime", due.toISOString());
  
	  // Time remaining
	  const { text, cls } = getTimeRemaining(due, isCompleted);
	  timeEl.textContent = text;
	  timeEl.setAttribute("datetime", due.toISOString());
	  timeEl.className = cls;
  
	  // Auto-update status & card 
	  if (!isCompleted && statusEl) {
		if (cls === "overdue") {
		  statusEl.textContent = "Overdue";
		  statusEl.className   = "badge status-overdue";
		}
	  }
	}
  
	// Checkbox 
  
	function initCheckbox() {
	  const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
	  const card     = document.querySelector('[data-testid="test-todo-card"]');
	  const statusEl = document.querySelector('[data-testid="test-todo-status"]');
  
	  if (!checkbox) return;
  
	  checkbox.addEventListener("change", function () {
		if (checkbox.checked) {
		  card.classList.add("completed");
		  if (statusEl) {
			statusEl.textContent = "Completed";
			statusEl.className   = "badge status-completed";
		  }
		} else {
		  card.classList.remove("completed");
		  if (statusEl) {
			statusEl.textContent = "In Progress";
			statusEl.className   = "badge status-progress";
		  }
		}
		update();
	  });
	}
  
	// Button 
  
	function initButtons() {
	  const editBtn   = document.querySelector('[data-testid="test-todo-edit-button"]');
	  const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');
	  const card      = document.querySelector('[data-testid="test-todo-card"]');
  
	  if (editBtn) {
		editBtn.addEventListener("click", function () {
		  alert("Edit clicked!");
		});
	  }
  
	  if (deleteBtn) {
		deleteBtn.addEventListener("click", function () {
		  if (card) card.remove();
		});
	  }
	}
  
	// Init
  
	function init() {
	  update();
	  initCheckbox();
	  initButtons();
	  setInterval(update, INTERVAL_MS);
	}
  
	document.readyState === "loading"
	  ? document.addEventListener("DOMContentLoaded", init)
	  : init();
  
  })();