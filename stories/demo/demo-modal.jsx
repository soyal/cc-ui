import React, {Component} from 'react'
import Modal from 'modal'
import Button from 'button'
import 'modal/index.css'
import 'button/index.css'

class DemoModal extends Component {
  state = {
    show: false
  }

  render() {
    return (
      <div>
        <Button type="primary"
          size="medium"
          onClick={() => {
            this.setState({
              show: true
            })
          }}>显示模态框</Button>

          <Modal show={this.state.show}
            title="这是一个模态框"
            onClose={() => {
              this.setState({
                show: false
              })
            }}>
            <div>自定义内容</div>
          </Modal>
      </div>
    )
  }
}

export default DemoModal