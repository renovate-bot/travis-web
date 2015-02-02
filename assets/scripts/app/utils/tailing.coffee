class Tailing
  options:
    timeout: 200

  tail: ->
    $(@tail_selector)
  log: ->
    $(@log_selector)

  constructor: (@window, @tail_selector, @log_selector) ->
    @position = @window.scrollTop()
    @window.scroll( Ember.run.throttle(this, @onScroll, [], 200, false) )
    this

  run: ->
    @autoScroll()
    @positionButton()
    Ember.run.later(@run.bind(this), @options.timeout) if @active()

  toggle: ->
    if @active() then @stop() else @start()

  active: ->
    @tail().hasClass('active')

  start: ->
    @tail().addClass('active')
    @run()

  isActive: ->
    @tail().hasClass('active')

  stop: ->
    @tail().removeClass('active')

  autoScroll: ->
    return false unless @active()
    logBottom = @log().offset().top + @log().outerHeight() + 40
    winBottom = @window.scrollTop() + @window.height()

    if logBottom - winBottom > 0
      @window.scrollTop(logBottom - @window.height())
      true
    else
      false

  onScroll: ->
    @positionButton()
    position = @window.scrollTop()
    @stop() if position < @position
    @position = position

  positionButton: ->
    tail = $('#tail')
    return if tail.length is 0
    offset = $(window).scrollTop() - $('#log').offset().top
    max = $('#log').height() - $('#tail').height() + 5
    offset = max if offset > max
    if offset > 0
      tail.css(top: offset - 2)
    else
      tail.css(top: 0)

Travis.Tailing = Tailing
