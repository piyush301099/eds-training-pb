export function checkImageSliderId(imageSliderId = '') {
  if (imageSliderId) {
    const imgSliderElement = document.getElementById(imageSliderId);
    if (imgSliderElement) {
      return imgSliderElement;
    }
    throw new Error(`ux-lds - ImageSlider: No image slider with id=${imageSliderId} found`);
  }
  throw new Error('ux-lds - ImageSlider: No imageSliderId provided to function');
}

export function setCurrentSlide({
  elem,
  current = 1,
} = {}) {
  const currentSpanElm = elem.querySelector('.lds-image-slider-counter span.active-count');
  if (!currentSpanElm) {
    throw new Error('ux-lds - ImageSlider: .lds-image-slider-counter span.active-count not found');
  }
  currentSpanElm.textContent = current;
}

export function setTotalSlide({
  elem,
  total = 2,
} = {}) {
  const totalSpanElm = elem.querySelector('.lds-image-slider-counter span.total-count');
  if (!totalSpanElm) {
    throw new Error('ux-lds - ImageSlider: .lds-image-slider-counter span.total-count not found');
  }
  totalSpanElm.textContent = total;
}

export function gotoSlide({
  imageSliderId,
  index = 0,
} = {}) {
  const elem = checkImageSliderId(imageSliderId);
  if (!elem) return;

  const images = elem.querySelectorAll('.lds-image-slider-frame div.lds-image-slider-frame-segment');
  if (!images || images.length < 2) {
    throw new Error(`ux-lds - ImageSlider: Incorrect number of images found in .lds-image-slider-frame. Expected atleast 2 Images. found ${images.length}`);
  }
  const total = images.length;
  const dots = elem.querySelectorAll('.lds-image-slider-dots button');
  if (!dots || dots.length !== total) {
    throw new Error(`ux-lds - ImageSlider: Incorrect number of dot buttons found in .lds-image-slider-dots. Expected ${total} button elements`);
  }
  const captions = elem.querySelectorAll('.lds-image-slider-captions p');
  if (!captions || captions.length !== total) {
    throw new Error(`ux-lds - ImageSlider: Incorrect number of caption p tags found in .lds-image-slider-captions. Expected ${total} p elements`);
  }
  dots.forEach(dot => dot.classList.remove('active'));
  captions.forEach(caption => caption.classList.remove('active'));
  dots[index].classList.add('active');
  captions[index].classList.add('active');
  images[index].scrollIntoView({
    behavior: 'smooth',
    inline: 'start',
    block: 'nearest',
  });
  setCurrentSlide({ elem, current: index + 1 });
}

export function gotoNextSlide({
  imageSliderId,
  counter = 0,
} = {}) {
  const elem = checkImageSliderId(imageSliderId);
  if (!elem) return;

  const dots = elem.querySelector('.lds-image-slider-dots');
  if (!dots) {
    throw new Error('ux-lds - ImageSlider: .lds-image-slider-dots not found');
  }
  const currentDot = dots.querySelector('.active');
  const totalSlides = dots.children.length;
  let slideIndex = Array.from(dots.children).indexOf(currentDot);
  slideIndex += counter;
  if (slideIndex >= totalSlides) { slideIndex = 0; }
  if (slideIndex < 0) { slideIndex = totalSlides - 1; }
  setTotalSlide({ elem, total: totalSlides });
  gotoSlide({ imageSliderId, index: slideIndex });
}

export function toggleExpanded(imageSliderId = '') {
  const elem = checkImageSliderId(imageSliderId);
  if (!elem) return;

  const toggleBtn = elem.querySelector('.lds-image-slider-full-screen-toggle');
  if (!toggleBtn) {
    throw new Error('ux-lds - ImageSlider: .lds-image-slider-full-screen-toggle not found');
  }
  const iconElm = toggleBtn.children[0];
  if (iconElm.classList.contains('arrows-in-simple')) {
    iconElm.classList.remove('arrows-in-simple');
    iconElm.classList.add('arrows-out-simple');
  } else if (iconElm.classList.contains('arrows-out-simple')) {
    iconElm.classList.remove('arrows-out-simple');
    iconElm.classList.add('arrows-in-simple');
  }
  elem.classList.toggle('expanded');
}
