require 'erb'
require 'securerandom'
require 'pp'

class GeneratePomTrackerSeeds

  TASK_OIDS = %w(5ad754b029854c60044217a7 5b1a62e171f06470352fc2e5 5b2018805c74a994090773aa)

  def output_seeds_to_file(dest_path)
    dest_file_path = File.join(dest_path, 'pom_tracker_seeds.json')
    File.open(dest_file_path, 'w+') do |dest_file|

      @dest_file = dest_file

      @current_time = Time.now
      # @current_time = Time.now - 4 * 24 * 60 * 60 # Create for 4 days ago
      current_year, current_month, current_day = @current_time.year, @current_time.month, @current_time.day
      @current_time = Time.new(current_year, current_month, current_day, 7)
      # puts current_time.strftime('%F - %I:%M:%S %P')

      (1..20).each do |i|
        output_document_to_dest_file(i)
      end
    end
  end

  private

  def minutes_elapsed_from_tracker_type(tracker_type)
    case tracker_type
      when 'pom'
        25
      when 'shortBrk'
        5
      when 'longBrk'
        10
    end
  end

  def get_task_oid_from_iteration(iteration_number)
    case iteration_number
      when 1..6
        TASK_OIDS[0]
      when 7..12
        TASK_OIDS[1]
      when 13..18
        TASK_OIDS[2]
      else
        TASK_OIDS[0]
    end
  end

  def tracker_type_from_iteration(iteration_number)
    if iteration_number == 1
      'pom'
    elsif (iteration_number % 6).zero?
      'longBrk'
    elsif iteration_number.odd?
      'pom'
    else
      'shortBrk'
    end
  end

  def tracker_type_time_delta_in_seconds(tracker_type)
    case tracker_type
      when 'pom'
        25 * 60
      when 'shortBrk'
        5 * 60
      when 'longBrk'
        10 * 60
    end
  end

  def output_document_to_dest_file(i)
    puts '*' * 10
    random_hex_str = SecureRandom.hex[0..23]
    tracker_type = tracker_type_from_iteration(i)
    puts tracker_type

    formatted_created_at = @current_time.strftime('%FT%H:%M:%S.%LZ')
    puts "created_at: #{@current_time.strftime('%I:%M:%S %P')}"

    puts "time_delta_in_secs: #{tracker_type_time_delta_in_seconds(tracker_type)}"
    raw_closed_time = @current_time + tracker_type_time_delta_in_seconds(tracker_type)
    formatted_closed_time = raw_closed_time.strftime('%FT%H:%M:%S.%LZ')
    puts "closed_time: #{raw_closed_time.strftime('%I:%M:%S %P')}"

    # TODO - refactor this into a method(s)
    interval_successful, minutes_elapsed, interval_closed = if i == 3    # SAD - pom that was stopped/reset
                                                              [false, 12, true]
                                                            elsif i == 4 # SAD - shortBrk that was stopped/reset
                                                              [false, 3, true]
                                                            elsif i == 6 # SAD - longBrk that encountered a page refresh
                                                              [false, 7, false]
                                                            else         # HAPPY
                                                              [true, minutes_elapsed_from_tracker_type(tracker_type), true]
                                                            end

    # task_oid = TASK_OIDS[rand(2)]
    task_oid = get_task_oid_from_iteration(i)

    @current_time += tracker_type_time_delta_in_seconds(tracker_type)

    erb_template = '{"_id":{"$oid":"<%= random_hex_str %>"},"updatedAt":{"$date":"<%= formatted_created_at %>"},"createdAt":{"$date":"<%= formatted_created_at %>"},"trackerType":"<%= tracker_type %>","task":{"$oid":"<%= task_oid %>"},"user":{"$oid":"59941f8cf75c0a9829296d86"},"closed":<%= interval_closed %>,"intervalSuccessful": <%= interval_successful %>,"timesPaused":0,"minutesElapsed":<%= minutes_elapsed %>,"__v":0,"closedTime":{"$date":"<%= formatted_closed_time %>"}}'
    document_string = ERB.new(erb_template).result(binding) # NOTE: db records are refered to as 'documents' in MongoDB
    @dest_file << document_string
  end
end

dest_file_path = 'C:\Projects\Todo_Tomatoinator_Mongo\server\seeds'
gpts = GeneratePomTrackerSeeds.new
gpts.output_seeds_to_file(dest_file_path)

`mongoimport --db todotomatoinator --collection pomtrackers --file C:/Projects/Todo_Tomatoinator_Mongo/server/seeds/pom_tracker_seeds.json`

__END__
test_var = 'WORLD'
random_hex_str = SecureRandom.hex[0..23]
# TODO: set createdAt, trackerType
erb_template << '{"_id":{"$oid":"<%= random_hex_str %>"},"updatedAt":{"$date":"2018-06-23T14:37:01.043Z"},"createdAt":{"$date":"2018-06-23T14:36:57.212Z"},"trackerType":"pom","task":{"$oid":"5ad754b029854c60044217a7"},"user":{"$oid":"59941f8cf75c0a9829296d86"},"closed":true,"intervalSuccessful":false,"timesPaused":0,"minutesElapsed":1,"__v":0,"closedTime":{"$date":"2018-06-23T14:37:01.043Z"}}'
puts ERB.new(erb_template).result(binding)
