import weixin from "./weixin";

class Registry {
  serviceMap = {};

  register(platform, service) {
    this.serviceMap[platform] = service;
  }

  get(platform) {
    return this.serviceMap[platform];
  }
}

const registry = new Registry();

registry.register("WxWork", weixin);

export default registry;
