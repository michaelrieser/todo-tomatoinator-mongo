require 'erb'
require 'securerandom'
require 'pp'
require 'date'

class GeneratePomTrackerSeeds

  # TASK_OIDS = %w(5ad754b029854c60044217a7 5b1a62e171f06470352fc2e5 5b2018805c74a994090773aa) # NW
  TASK_OIDS = %w(5c02dab787cbb324e4083e4b 5c02daa187cbb324e4083e49 5c02da7e87cbb324e4083e48) # AW

  # USER_OID = '59941f8cf75c0a9829296d86' # NW
  USER_OID = '5a394ba65afee4dc27163168' # AW

  def create_pomtrackers_for_time_horizon(dest_path, time_horizon)

    dest_file_path = File.join(dest_path, 'pom_tracker_seeds.json')
    File.truncate(dest_file_path, 0)

    case time_horizon
      when 'daily'
        output_seed_documents_to_file(dest_file_path,DateTime.now)
      when 'weekly'
        ((DateTime.now-6)..DateTime.now).each do |dt|
          output_seed_documents_to_file(dest_file_path, dt)
        end
      when 'monthly'
        ((DateTime.now-30)..DateTime.now).each do |dt|
          output_seed_documents_to_file(dest_file_path, dt)
        end
      else
        raise "#{time_horizon} not specified!"
    end

  end

  def output_seed_documents_to_file(dest_file_path, date_time_obj)
    File.open(dest_file_path, 'a') do |dest_file| # 'a' => 'Write-only': starts at end of file || creates new file

      @dest_file = dest_file

      @current_time = date_time_obj
      # @current_time = Time.now - 4 * 24 * 60 * 60 # Create for 4 days ago

      # cwday=1[, hour=0[, minute=0[, second=0[, offset=0[, start=Date::ITALY]]]]]]]])  ->  datetime
      current_day = @current_time.day
      current_month = @current_time.month
      current_year = @current_time.year
      current_hour = @current_time.hour
      current_minute = @current_time.minute
      current_second = @current_time.second

      # TODO: for some reason setting 7 as hour results in pomreports starting at 2AM - need to account for timezone?
      @current_time = DateTime.new(current_year, current_month, current_day, 12, 0, current_second, @current_time.zone) # create new DateTime object with today's year, month, day starting at 7AM
      puts @current_time.strftime('%F - %I:%M:%S %P')

      (1..20).each do |i|
        output_seed_document_to_dest_file(i)
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

  def output_seed_document_to_dest_file(i)
    # puts '*' * 10
    random_hex_str = SecureRandom.hex[0..23]
    tracker_type = tracker_type_from_iteration(i)
    # puts tracker_type

    formatted_created_at = @current_time.strftime('%FT%H:%M:%S.%LZ')
    # puts "created_at: #{formatted_created_at}"
    # puts "created_at: #{@current_time.strftime('%I:%M:%S %P')}"

    # puts "time_delta_in_secs: #{tracker_type_time_delta_in_seconds(tracker_type)}"
    raw_closed_time = @current_time + Rational(tracker_type_time_delta_in_seconds(tracker_type), 60 * 60 * 24) # DateTime adds as days, convert secs to days
    formatted_closed_time = raw_closed_time.strftime('%FT%H:%M:%S.%LZ')
    # puts "closed_time: #{formatted_closed_time}"
    # puts "closed_time: #{raw_closed_time.strftime('%I:%M:%S %P')}"

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

    time_delta_in_seconds = tracker_type_time_delta_in_seconds(tracker_type)
    @current_time += Rational(time_delta_in_seconds, 60 * 60 * 24) # DateTime adds as days (Time adds seconds), need to convert seconds to days

    # puts @current_time.strftime('%FT%H:%M:%S.%LZ')

    erb_template = '{"_id":{"$oid":"<%= random_hex_str %>"},"updatedAt":{"$date":"<%= formatted_created_at %>"},"createdAt":{"$date":"<%= formatted_created_at %>"},"trackerType":"<%= tracker_type %>","task":{"$oid":"<%= task_oid %>"},"user":{"$oid":"<%= USER_OID %>"},"closed":<%= interval_closed %>,"intervalSuccessful": <%= interval_successful %>,"timesPaused":0,"minutesElapsed":<%= minutes_elapsed %>,"__v":0,"closedTime":{"$date":"<%= formatted_closed_time %>"}}'
    document_string = ERB.new(erb_template).result(binding) # NOTE: db records are refered to as 'documents' in MongoDB
    @dest_file << document_string
  end
end

dest_file_path = 'C:\Projects\AngularJS\Todo_Tomatoinator_Mongo\server\seeds'
gpts = GeneratePomTrackerSeeds.new
gpts.create_pomtrackers_for_time_horizon(dest_file_path, 'monthly')

`cd C:/Program Files/MongoDB/Server/3.4.0/bin/ && mongoimport --db todotomatoinator --collection pomtrackers --file C:/Projects/AngularJS/Todo_Tomatoinator_Mongo/server/seeds/pom_tracker_seeds.json`

__END__
test_var = 'WORLD'
random_hex_str = SecureRandom.hex[0..23]
# TODO: set createdAt, trackerType
erb_template << '{"_id":{"$oid":"<%= random_hex_str %>"},"updatedAt":{"$date":"2018-06-23T14:37:01.043Z"},"createdAt":{"$date":"2018-06-23T14:36:57.212Z"},"trackerType":"pom","task":{"$oid":"5ad754b029854c60044217a7"},"user":{"$oid":"59941f8cf75c0a9829296d86"},"closed":true,"intervalSuccessful":false,"timesPaused":0,"minutesElapsed":1,"__v":0,"closedTime":{"$date":"2018-06-23T14:37:01.043Z"}}'
puts ERB.new(erb_template).result(binding)
