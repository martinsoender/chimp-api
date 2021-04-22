// Documentation:
// https://developer.mailchimp.com/documentation/mailchimp/reference/lists/members

export default class ListMember {
  constructor(info) {
    this.info = {
      email_address,
      status,
      merge_fields,
      language,
      vip,
      tags,
      ...info
    }
  }

  subscribe() {

  }

  unsubscribe() {

  }
}
