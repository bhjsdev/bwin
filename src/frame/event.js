export default {
  on(eventName, listener) {
    this.eventListeners ??= new Map();

    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Set());
    }
    this.eventListeners.get(eventName).add(listener);
  },

  off(eventName, listener) {
    this.eventListeners?.get(eventName)?.delete(listener);
  },

  // Runs every listener; returns `false` when any listener vetoed (returned `false`), else `true`.
  emit(eventName, detail) {
    const listeners = this.eventListeners?.get(eventName);
    if (!listeners) return true;

    let allowed = true;
    for (const listener of listeners) {
      if (listener(detail) === false) allowed = false;
    }
    return allowed;
  },
};
