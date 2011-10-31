<?php
class ControllerModuleFaq extends Controller {
	protected function index() {
		$this->language->load('module/faq');
		$this->load->model('fido/faq');

    	$this->data['heading_title'] = $this->language->get('heading_title');

		if (isset($this->request->get['topic'])) {
			$parts = explode('_', (string)$this->request->get['topic']);
		} else {
			$parts = array();
		}

		if (isset($parts[0])) {
			$this->data['topic_id'] = $parts[0];
		} else {
			$this->data['topic_id'] = 0;
		}

		if (isset($parts[1])) {
			$this->data['child_id'] = $parts[1];
		} else {
			$this->data['child_id'] = 0;
		}

		$this->data['faqs'] = array();

		$faqs = $this->model_fido_faq->getTopics(0);

		foreach ($faqs as $faq) {
			$children_data = array();

			$children = $this->model_fido_faq->getTopics($faq['faq_id']);

			foreach ($children as $child) {
				$data = array(
					'filter_faq_id'  => $child['faq_id'],
					'filter_sub_faq' => true
				);

				$children_data[] = array(
					'faq_id'      => $child['faq_id'],
					'title'       => $child['title'],
					'href'        => $this->url->link('information/faq', 'topic=' . $faq['faq_id'] . '_' . $child['faq_id'])
				);
			}

			$data = array(
				'filter_faq_id'  => $faq['faq_id'],
				'filter_sub_faq' => true
			);

			$this->data['faqs'][] = array(
				'faq_id'      => $faq['faq_id'],
				'title'       => $faq['title'],
				'children'    => $children_data,
				'href'        => $this->url->link('information/faq', 'topic=' . $faq['faq_id'])
			);
		}

		if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . '/template/module/faq.tpl')) {
			$this->template = $this->config->get('config_template') . '/template/module/faq.tpl';
		} else {
			$this->template = 'default/template/module/faq.tpl';
		}

		$this->render();
  	}
}
?>
